var fs = require('fs');
var sep = ','
fs.write('./data.csv' , 'name'+sep+'email'+"\n" , 'w')

var links = [];
var casper = require('casper').create({
  verbose: true,
  logLevel: "debug",
  pageSettings: {
    loadImages: false, // The WebPage instance used by Casper will
    loadPlugins: false // use these settings
  }
});

function getLinks() {
  var links = document.querySelectorAll('tr[bgcolor="#ffffff"] a[href^="/PartnersListingREFRID.asp?"]')
  return Array.prototype.map.call(links, function (l) {
    return {
      name: l.textContent,
      href: "http://www.clasificadosonline.com" + l.getAttribute('href')
    }
  })
}

var url = "http://www.clasificadosonline.com/Rentals.asp"

casper.start(url, function () {
  this.waitForSelector('table');
});

// can't get email ... 
function getEmail(){
  var text = document.querySelector('.Tahoma14Gris').textContent 
  var index = text.indexOf('e-mail: ') + 8
  return text.substring(index).trim()
}

casper.then(function () {
  links = this.evaluate(getLinks)
  casper.each(links, function (self, link) {
    var email 
    var name 
    self.thenOpen(link.href , function () {
        // email = this.evaluate(getEmail)
        email = "email should go here"
        name =  link.name
        fs.write('data.csv', name+sep+email+ "\n" , 'a') 
        this.page.close() // memory leakage 
    })
  });
})

casper.run(function () {
  casper.exit()
});