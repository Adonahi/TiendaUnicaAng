import { KeyValue } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { confetti } from 'tsparticles-confetti';
import { CUMPLES } from './cumpleanhos';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements AfterViewInit{
  cumples = CUMPLES;

  ordenar = (a: KeyValue<string, Date>, b: KeyValue<string, Date>): number => {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    b.value.setMilliseconds(1);
    let diferencia = -1 * (today.getTime() - b.value.getTime());
    return diferencia;
  } 

  ngAfterViewInit(): void {
    for (const key in this.cumples) {
      if (Object.prototype.hasOwnProperty.call(this.cumples, key)) {
        const element = this.cumples[key as keyof typeof this.cumples];
        if(element.getDate() == new Date().getDate() && element.getMonth() == new Date().getMonth()){
          let texto = document.getElementById(key);
          this.confeti();
          break;
        }
      }
    }
  }
  
  confeti(){
    const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

}
