function Vocabulary(){
  this.page={};
  this.addPage=function(page){
    this.page[page.name]=page;
  };
}

function Page(name){
  this.name = name;
  this.phrase={};
  this.addPhrase=function(label,content){
    this.phrase[label] = new Phrase(content);
    return this;
  };
};

/*
example:
new Word(
  "it":"contatti",
  "en":"contacts"
);
*/
function Phrase(content){
  this.lang = content;
}
