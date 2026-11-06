import {test,expect} from 'bun:test';
import {boatFrame,boatDuration} from './boat-transition.js';

test('the boat keeps moving, fits the centre and leaves a completely revealed page',()=>{
  for(const width of [316,320,390,768,1024,1440]){
    let previous=-Infinity;
    for(let elapsed=0;elapsed<=boatDuration;elapsed+=10){
      const pose=boatFrame(elapsed,width,1000);
      expect(pose.center).toBeGreaterThan(previous);previous=pose.center;
      expect(pose.frame).toBeGreaterThanOrEqual(0);expect(pose.frame).toBeLessThan(270);
    }
    const middle=boatFrame(boatDuration/2,width,1000),end=boatFrame(boatDuration,width,1000);
    expect(middle.x).toBeGreaterThanOrEqual(0);expect(middle.x+middle.size).toBeLessThanOrEqual(width);
    expect(middle.segment).toBe('bucle');expect(end.opacity).toBe(0);
    expect(end.x).toBeGreaterThan(width);expect(end.stop).toBeGreaterThanOrEqual(width-0.001);
  }
});
