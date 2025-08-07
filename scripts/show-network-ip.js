const os = require('os');

function getNetworkIPs() {
  const networks = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(networks)) {
    for (const net of networks[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        ips.push({
          interface: name,
          address: net.address
        });
      }
    }
  }
  
  return ips;
}

console.log('\n🌐 VIBE SOCIAL NETWORK - URLs de Acesso:');
console.log('═══════════════════════════════════════════════');

const ips = getNetworkIPs();

if (ips.length > 0) {
  console.log('\n📱 Para acessar do seu celular na mesma rede:');
  ips.forEach(({ interface, address }) => {
    console.log(`   Frontend: http://${address}:3000`);
    console.log(`   Backend:  http://${address}:8000`);
    console.log(`   Interface: ${interface}\n`);
  });
} else {
  console.log('\n❌ Não foi possível detectar o IP da rede');
  console.log('   Tente descobrir manualmente o IP da sua máquina');
}

console.log('💻 Para acessar localmente:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:8000');

console.log('\n📋 Dicas para acesso mobile:');
console.log('   1. Certifique-se que o celular está na mesma rede WiFi');
console.log('   2. Use um dos IPs mostrados acima no navegador do celular');
console.log('   3. Se não funcionar, verifique o firewall da máquina');
console.log('   4. Alguns roteadores bloqueiam acesso entre dispositivos\n');
