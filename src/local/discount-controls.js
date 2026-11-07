import {money} from '../lib/market.js';
import {discountQuote} from '../lib/discount.js';

let activeNumber,dragging=false,growthTimer;
function stopGrowth(){dragging=false;clearTimeout(growthTimer);activeNumber?.classList.remove('is-adjusting');activeNumber=null;}
document.addEventListener('pointerup',stopGrowth);
document.addEventListener('pointercancel',stopGrowth);
window.addEventListener('blur',stopGrowth);

export function initializeDiscountControls(container){
  for(const editor of container.querySelectorAll('[data-discount-editor]')){
    if(editor.dataset.discountReady)return;
    editor.dataset.discountReady='true';
    const find=selector=>editor.querySelector(selector),form=editor.closest('form');
    const price=form.elements.basePrice,number=form.elements.discountPercent,promotion=form.elements.promotion;
    const range=find('[data-discount-range]'),fields=find('[data-discount-fields]'),wrap=find('[data-discount-number-wrap]');
    let announcementTimer;
    function error(selector,message,input){const area=find(selector);area.textContent=message;area.hidden=!message;input.setAttribute('aria-invalid',String(Boolean(message)));input.setCustomValidity(message);}
    function render(){
      let priceError='',percentError='',result;
      try{discountQuote(price.value,0);}catch(failure){priceError=failure.message;}
      if(promotion.checked)try{discountQuote('0',number.value);}catch(failure){percentError=failure.message;}
      error('#base-price-error',price.value?priceError:'',price);error('#discount-percent-error',percentError,number);
      if(!priceError&&!percentError)result=discountQuote(price.value,promotion.checked?number.value:0);
      fields.disabled=!promotion.checked;fields.hidden=!promotion.checked;
      find('[data-discount-panel]').hidden=!promotion.checked;
      wrap.toggleAttribute('data-wide',number.value.length>3);
      const percent=promotion.checked&&result?result.discountPercent:0;
      range.disabled=Boolean(percentError);
      if(!percentError){range.value=number.value;range.setAttribute('aria-valuetext',`${number.value} por ciento`);range.style.setProperty('--discount-progress',`${Number(number.value)}%`);}
      for(const button of editor.querySelectorAll('[data-discount-preset]'))button.setAttribute('aria-pressed',String(!percentError&&Number(button.dataset.discountPreset)===Number(number.value)));
      for(const [selector,key] of [['[data-discount-final]','totalCents'],['[data-discount-base]','baseCents'],['[data-discount-saving]','savingCents'],['[data-discount-original]','baseCents']])find(selector).textContent=result?money(result[key]/100):'—';
      find('[data-discount-original]').hidden=!result||percent===0;
      find('[data-discount-badge]').hidden=!result;
      find('[data-discount-badge]').textContent=percent?`${percent} % de descuento`:'Sin descuento';
      find('[data-discount-percentage]').textContent=result?`${percent} %`:'—';
      find('[data-discount-summary-note]').textContent=!result?'Escribe un precio y un porcentaje válidos para calcular el importe final.':percent===100?'Con 100 % de descuento, el precio final es cero.':percent>0&&result.savingCents===0?'Este descuento no reduce el precio al redondear a centavos.':'El precio final se redondea a centavos.';
      clearTimeout(announcementTimer);
      announcementTimer=setTimeout(()=>{find('[data-discount-announcement]').textContent=result?`Descuento ${percent} por ciento. Precio final ${money(result.totalCents/100)}.`:'Revisa el precio o el porcentaje.';},400);
    }
    function grow(){
      if(activeNumber&&activeNumber!==wrap)activeNumber.classList.remove('is-adjusting');
      activeNumber=wrap;clearTimeout(growthTimer);wrap.classList.add('is-adjusting');
      if(!dragging)growthTimer=setTimeout(stopGrowth,220);
    }
    number.addEventListener('focus',()=>number.select());
    number.addEventListener('input',render);price.addEventListener('input',render);promotion.addEventListener('change',render);
    range.addEventListener('pointerdown',()=>{dragging=true;grow();});
    range.addEventListener('input',()=>{number.value=range.value;render();grow();});
    editor.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled)return;if(button.hasAttribute('data-discount-preset')){number.value=button.dataset.discountPreset;render();}else if(button.hasAttribute('data-discount-reset')){number.value='0';render();}});
    render();
  }
}
