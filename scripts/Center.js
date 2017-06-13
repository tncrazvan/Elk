/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function center(element, parent){
    if(!isset(parent)){
        parent = document.body;
    }
    element.style.left = Pixel(parent.offsetWidth/2-element.offsetWidth*2);
    element.style.top = Pixel(parent.offsetHeight/2-element.offsetHeight*2);
}