import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../assets/css/global.css', './header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {}

  ngAfterViewInit() {
    $(document).ready(() => {
      //menu header
      function showWidth(ele: any, w: any) {
        return w;
      }
      $('.header-bar').on('click', () => {
        $('.menu').toggleClass('active');
        $('.header-bar').toggleClass('active');
        $('.overlay').toggleClass('active');
      });

      $('.overlay').on('click', () => {
        $('.menu').removeClass('active');
        $('.header-bar').removeClass('active');
        $('.overlay').removeClass('active');
      });

      $('ul>li>.submenu').parent('li').addClass('menu-item-has-children');

      $('ul')
        .parent('li')
        .hover(function () {
          var menu = $(this).find('ul');
          var menupos = menu.offset();
          if (menupos && menu.length > 0) {
            // Vérifier si menu est défini
            if (
              menupos.left + showWidth('menu', $(menu).width()) >
              showWidth('window', $(menu).width())
            ) {
              var newpos = -showWidth('menu', $(menu).width());
              menu.css({
                left: newpos,
              });
            }
          }
        });

      $('.menu li a').on('click', (e) => {
        var element = $(e.target).parent('li');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('li').removeClass('open');
          element.find('ul').slideUp(300, 'swing');
        } else {
          element.addClass('open');
          element.children('ul').slideDown(300, 'swing');
          element.siblings('li').children('ul').slideUp(300, 'swing');
          element.siblings('li').removeClass('open');
          element.siblings('li').find('li').removeClass('open');
          element.siblings('li').find('ul').slideUp(300, 'swing');
        }
      });
    });
  }

  removeClass() {
    const divElement1 = this.el.nativeElement.querySelector('#monDiv1');
    const divElement2 = this.el.nativeElement.querySelector('#monDiv2');
    if (divElement1 && divElement2) {
      this.renderer.removeClass(divElement1, 'active');
      this.renderer.removeClass(divElement2, 'active');
    }
  }
}
