chrome.storage.local.get(['xbox-converter'], (flags) => {
  if (!flags['xbox-converter']) {
    return;
  }

  let dollar = 0;
  function fetchOfficialDollar() {
    return fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
      .then(response => response.json())
      .then(casa => {
        return parseFloat(casa[0].casa.compra.replace(',', '.'));
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

  function convert(price, dollar) {
    return ((price / dollar) * dollar * 1.65).toFixed(2);
  };

  function run() {
    const $prices = document.querySelectorAll('[itemprop="price"]');
    $prices.forEach((node) => {
      const price = Number.parseFloat(node.textContent.replace(/(\$\s|\.)/gi, '').replace(',','.')).toFixed();
      node.innerHTML = `💳🇦🇷 ${formatter.format(convert(price, dollar))}`;
    });
  }

  const target = document.querySelector('.gameDivsWrapper');
  const observer = new MutationObserver(() => run());
  observer.observe(target, { childList: true });

});
