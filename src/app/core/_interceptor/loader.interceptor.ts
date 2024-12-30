// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';
// import { LoaderService } from '../_services/shared/loader.service';

// @Injectable()
// export class LoaderInterceptor implements HttpInterceptor {
//   constructor(public loaderService: LoaderService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     this.loaderService.isLoading.next(true);
//     return next.handle(req).pipe(
//       finalize(() => {
//         this.loaderService.isLoading.next(false);
//       })
//     );
//   }
// }
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../_services/shared/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(public loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const noLoaderHeader = req.headers.get('NoLoaderRequest');
    const showLoader = noLoaderHeader ? noLoaderHeader !== 'true' : true;

    if (showLoader) {
      this.loaderService.isLoading.next(true);
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (showLoader) {
          this.loaderService.isLoading.next(false);
        }
      })
    );
  }
}
