chrome.storage.local.get(['xbox-converter'], (flags) => {
  if (!flags['xbox-converter']) {
    return;
  }

  const IVA = 0.21;
  const IIBB = 0.02;
  const AFIP = 0.35;
  const PAIS = 0.08;

  let dollar = 0;
  function fetchOfficialDollar() {
    return fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
      .then(response => response.json())
      .then(data => {
        return parseFloat(data[0].casa.compra.replace(',', '.'));
      });
  }
  async function boot() {
    dollar = await fetchOfficialDollar();
  }

  boot();

  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  function toFixed(num) {
    var d = 2,
      m = Math.pow(10, d),
      n = +(d ? num * m : num).toFixed(8),
      i = Math.floor(n), f = n - i,
      e = 1e-8,
      r = (f > 0.5 - e && f < 0.5 + e) ?
      ((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
  }

  function convert(price, dollar) {
    const usdPrice = (price / dollar);
    const final = toFixed(usdPrice * dollar) + toFixed(price * IVA) + toFixed(price * IIBB) + toFixed(price * AFIP) + toFixed(price * PAIS);
    return final.toFixed(2);
  }

  function run(selector) {
    const $prices = document.querySelectorAll(selector);
    $prices.forEach((node) => {
      const price = Number.parseFloat(node.textContent.replace(/(\ARS\$\s|\$\s|\.|\+)/gi, '').replace(',','.')).toFixed(2);
      node.innerHTML = `🇦🇷 ${formatter.format(convert(price, dollar))} <small style="font-size:14px;display:block;">(impuestos incluidos)</small>`;
    });
  }

  try {
    const target = document.querySelector('.gameDivsWrapper');
    const observer = new MutationObserver(() => run('[itemprop="price"]'));
    observer.observe(target, { childList: true });
  } catch (error) {}

  try {
    const target = document.querySelector('[class*="ProductDetailsHeader-module__container__"]');
    const observer = new MutationObserver(() => run('[class*="Price-module__brandPrice"]'));
    observer.observe(target, { childList: true, characterData: true });
  } catch (error) {}

  try {
    const target = document.querySelector('.purchase1');
    const observer = new MutationObserver(() => run('.purchase1 .rightCol *'));
    observer.observe(target, { childList: true, characterData: true });
  } catch (error) {}

});
