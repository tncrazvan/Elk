/*
<div class="card" style="width: 18rem;">
  <img class="card-img-top" src=".../100px180/" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
*/
function Book(meta={"next":"Next","back":"Back"}){
    const card = create("div.card",[card_img_top,card_body]);
    const card_img_top = create("img.card-img-top");
    const card_body = create("div.card-body");

    const pages = new Array();

    const go_next = create("a.btn.btn-primary",meta.next);
    const go_back = create("a.btn.btn-primary",meta.back);

    let current_page = 0;


    this.addPage = function(title,content){
        const card_title = create("h5.card-title");
        pages.push({
            card_title:card_title,
            card_content:content
        });
    };
}