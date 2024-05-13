import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController, IonContent } from '@ionic/angular';

@Directive({
  selector: '[myScrollVanish]'
})
export class ScrollVanishDirective implements OnInit {
  @Input("myScrollVanish") scrollArea;
  @Input("height") height;
  
  private hidden: boolean = false;
  private triggerDistance: number = 20;

  constructor( private element: ElementRef, private renderer: Renderer2, private domCtrl: DomController
  ) {
    
  }

  ngOnInit() {
    if(this.scrollArea != undefined && this.scrollArea != ''){
      this.initStyles();


      this.scrollArea.ionScroll.subscribe(scrollEvent => {
        let delta = scrollEvent.detail.deltaY;
  
        if (scrollEvent.detail.currentY === 0 && this.hidden) {
          this.show();
        } else if (!this.hidden && delta > this.triggerDistance) {
          this.hide();
        } else if (this.hidden && delta < -this.triggerDistance) {
          this.show();
        }
      });
    }
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        "transition",
        "0.2s linear"
      );
      this.renderer.setStyle(this.element.nativeElement, "height", this.height);
     
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "min-height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "opacity", "0");
      this.renderer.setStyle(this.element.nativeElement, "padding", "0");
      this.renderer.setStyle(this.element.nativeElement, "z-index", "-1");
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "height", this.height);
      this.renderer.removeStyle(this.element.nativeElement, "opacity");
      this.renderer.removeStyle(this.element.nativeElement, "min-height");
      this.renderer.removeStyle(this.element.nativeElement, "padding");
      this.renderer.removeStyle(this.element.nativeElement, "z-index");
    });

    this.hidden = false;
  }
}