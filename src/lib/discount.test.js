import {test,expect} from 'bun:test';
import {discountQuote,discountForOffer} from './discount.js';

test('Descuentos en centavos, cero y cien por ciento',()=>{
  expect(discountQuote('25,00',20)).toEqual({baseCents:2500,totalCents:2000,savingCents:500,discountPercent:20});
  expect(discountQuote('0.05',50).totalCents).toBe(3);
  expect(discountQuote('10.01',0).totalCents).toBe(1001);
  expect(discountQuote('10.01',100).totalCents).toBe(0);
  expect(discountQuote('0',30).savingCents).toBe(0);
});

test('El dominio rechaza precios y porcentajes inválidos',()=>{
  for(const value of ['',-1,'1.001','1e2',NaN,1000001])expect(()=>discountQuote(value,20)).toThrow();
  for(const value of ['',-1,101,NaN,'2.000000001'])expect(()=>discountQuote('25',value)).toThrow();
  expect(discountQuote('100',20.5).totalCents).toBe(7950);
});

test('Recuperar promociones antiguas conserva importes, incluso porcentajes fraccionarios y precios extremos',()=>{
  for(const [old,price] of [[35,25],[12,10.25],[19.99,13.49],[1000000,999999.99],[1000000,0.01],[0.01,0]]){
    const recovered=discountForOffer({old,price});
    expect(recovered.basePrice).toBe(old);
    expect(discountQuote(recovered.basePrice,recovered.discountPercent).totalCents).toBe(Math.round(price*100));
  }
  expect(discountForOffer()).toEqual({basePrice:'',discountPercent:0});
  expect(discountForOffer({price:25})).toEqual({basePrice:25,discountPercent:0});
});

test('Conserva el porcentaje solicitado cuando el redondeo no cambia el precio y descarta metadatos obsoletos',()=>{
  expect(discountForOffer({price:0.05,discountPercent:10})).toEqual({basePrice:0.05,discountPercent:10});
  expect(discountForOffer({price:20,old:25,discountPercent:50})).toEqual({basePrice:25,discountPercent:20});
  expect(discountForOffer({price:20,old:25,discountPercent:'inválido'})).toEqual({basePrice:25,discountPercent:20});
});
