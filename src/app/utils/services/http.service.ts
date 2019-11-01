import { EventEmitter, Injectable } from '@angular/core';
import { ConnectionBackend, Headers, Http, RequestOptions, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import 'rxjs/Rx';
import { SessionStorage } from 'ngx-webstorage';
import { ErrorMessageService } from '../../error-message-service';

@Injectable()
export class HttpService extends Http {
	@SessionStorage('isLoading')
	public isLoading: boolean = false;

	@SessionStorage('user')
	public loggedInUser;

	public serverError: EventEmitter<Response> = new EventEmitter();

	constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, public errorService: ErrorMessageService) {
		super(backend, defaultOptions);

	}

    /**
     * Performs any type of http request.
     * @param url
     * @param options
     * @returns {Observable<Response>}
     */
	request(url: string, options?: RequestOptionsArgs): Observable<Response> {
		return super.request(url, options);
	}

    /**
     * Performs a request with `get` http method.
     * @param url
     * @param options
     * @returns {Observable<>}
     */


	get(url: string, options?: RequestOptionsArgs): Observable<any> {
		this.requestInterceptor();
		return super.get(this.getFullUrl(url), this.requestOptions(options))
			.timeout(3000000)
			.catch(this.onCatch)
			.do
			((res: Response) => {

				this.onSubscribeSuccess(res);
			},
			(error: any) => {
				if (!url.includes('getAllAdminStaff')) {
					this.errorService.translateErrors(JSON.parse(error._body).errorCode, JSON.parse(error._body).message);
					this.onSubscribeError(error);
				}

			})
			.finally(() => {
				this.onFinally();
			});
	}

	getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
		return super.get(url, options);
	}

    /**
     * Performs a request with `post` http method.
     * @param url
     * @param body
     * @param options
     * @returns {Observable<>}
     */
	post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
		this.requestInterceptor();
		return super.post(this.getFullUrl(url), body, this.requestOptions(options))
			.catch(this.onCatch)
			.do((res: any) => {

				this.onSubscribeSuccess(res);
				if (!url.includes('logout') &&
					!url.includes('login') &&
					!url.includes('get') &&
					!url.includes('vics')) {
					if(url.includes('cardholder')&&res._body==""){
                        this.errorService.translateErrors('1007', '');
					}else{
                        this.errorService.translateSuccess('add-update-success');
					}

				} else {
					if (url.includes('pdf') || url.includes('xlsx')|| url.includes('html') || url.includes('getListData') ) { }
					else
						if (url.includes('get')) {
							const items = JSON.parse(res._body);

							if (items.records) {
								if (items.records.length == 0) {
									this.errorService.translateErrors('no-data-available', '');
								}

							}
							else if (items) {
								if (items.length == 0) {
									this.errorService.translateErrors('no-data-available', '');
								}
							}
						}

				}

			}, (error: any) => {
				this.errorService.translateErrors(JSON.parse(error._body).errorCode, JSON.parse(error._body).message);
				this.onSubscribeError(error);
			}).finally(() => {
				this.onFinally();
			});
	}

	postSystemLog(body: any, options?: RequestOptionsArgs): Observable<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });

		this.requestInterceptor();
		return super.post(this.getFullUrlSystemLog(), body, { headers: headers })
			.catch(this.onCatch)
			.do((res: Response) => {
				this.onSubscribeSuccess(res);
			}, (error: any) => {
				this.errorService.translateErrors(JSON.parse(error._body).errorCode, JSON.parse(error._body).message);
				this.onSubscribeError(error);
			}).finally(() => {
				this.onFinally();
			});

	}

    /**
     * Performs a request with `put` http method.
     * @param url
     * @param body
     * @param options
     * @returns {Observable<>}
     */
	put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
		this.requestInterceptor();
		return super.put(this.getFullUrl(url), body, this.requestOptions(options))
			.catch(this.onCatch)
			.do
			((res: Response) => {
				this.errorService.translateSuccess('add-update-success');
				this.onSubscribeSuccess(res);
			},
			(error: any) => {
				this.errorService.translateErrors(JSON.parse(error._body).errorCode, JSON.parse(error._body).message);
				this.onSubscribeError(error);
			})
			.finally(() => {
				this.onFinally();
			});
	}

    /**
     * Performs a request with `delete` http method.
     * @param url
     * @param options
     * @returns {Observable<>}
     */
	delete(url: string, options?: RequestOptionsArgs): Observable<any> {
		this.requestInterceptor();
		return super.delete(this.getFullUrl(url), this.requestOptions(options))
			.catch(this.onCatch)
			.do
			((res: Response) => {
				this.errorService.translateSuccess('delete-success');
				this.onSubscribeSuccess(res);

			},
			(error: any) => {
				this.errorService.translateErrors(JSON.parse(error._body).errorCode, JSON.parse(error._body).message);
				this.onSubscribeError(error);
			})
			.finally(() => {
				this.onFinally();
			});
	}
    /**
     * Performs a request with `post` http method.
     * @param url
     * @param body
     * @param options
     * @returns {Observable<>}
     */
	uploadFile(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
		this.requestInterceptor();
		return super.post(this.getFullUrl(url), body)
			.catch(this.onCatch)
			.do
			((res: Response) => {

				this.onSubscribeSuccess(res);
			},
			(error: any) => {
				this.errorService.translateErrors(JSON.parse(error._body).errorCode, JSON.parse(error._body).message);
				this.onSubscribeError(error);
			})
			.finally(() => {
				this.onFinally();
			});
	}

    /**
     * AMS APIs.
     */

	getPe(url: string): Observable<any> {
		this.requestInterceptor();
		return super.get(this.getFullUrlPe(url))
			.timeout(3000000)
			.catch(this.onCatch)
			.do
			((res: Response) => {
				this.onSubscribeSuccess(res);
			},
			(error: any) => {
				this.onSubscribeError(error);
			})
			.finally(() => {
				this.onFinally();
			});
	}


	postPe(url: string, data: any) {
		this.requestInterceptor();
		return super.post(this.getFullUrlPe(url), data)
			.catch(this.onCatch)
			.do((res: Response) => {
				this.onSubscribeSuccess(res);
			}, (error: any) => {
				this.onSubscribeError(error);
			}).finally(() => {
				this.onFinally();
			});
	}

	deletePe(url: string): Observable<any> {
		this.requestInterceptor();
		return super.get(this.getFullUrlPe(url))
			.catch(this.onCatch)
			.do
			((res: Response) => {
				this.onSubscribeSuccess(res);
			},
			(error: any) => {
				this.onSubscribeError(error);
			})
			.finally(() => {
				this.onFinally();
			});
	}

	putPe(url: string, data: any) {
		this.requestInterceptor();
		return super.post(this.getFullUrlPe(url), data)
			.catch(this.onCatch)
			.do
			((res: Response) => {
				this.onSubscribeSuccess(res);
			},
			(error: any) => {
				this.onSubscribeError(error);
			})
			.finally(() => {
				this.onFinally();
			});
	}

    /**
     * Request options.
     * @param options
     * @returns {RequestOptionsArgs}
     */
	private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
		if (options == null) {
			options = new RequestOptions();
		}

		//if (options.headers == null) {
		options.headers = new Headers({ 'Content-Type': 'application/json' });
		//}
		// if (sessionStorage.getItem('accessToken')) {
		// 	options.headers = new Headers({
		// 		'Authentication-Code': sessionStorage.getItem('accessToken')
		// 	});
		// }.
		// options.headers.append('Accept-Language','en');


		options.headers.append('Accept-Language',this.errorService.getCurrentLang());
		 if (this.loggedInUser) {

			options.headers.append(
				'sessionToken', this.loggedInUser.sessionToken);

			options.headers.append(
				'userId', this.loggedInUser.id
			);
			options.headers.append(
				'csrfToken', this.loggedInUser.csrfToken
			);
            options.headers.append(
                'employeeId', this.loggedInUser.employeeId
            );
            options.headers.append(
                'userName', this.loggedInUser.name
            );
             
             
             
             
		 }

		return options;
	}

    /**
     * Build API url.
     * @param url
     * @returns {string}
     */
	private getFullUrl(url: string): string {
		// return full URL to API here
		return environment.baseUrl + url;
	}

	private getFullUrlSystemLog(): string {
		// return full URL to API here
		return environment.systemLogUrl;
	}

	private getFullUrlPe(url: string): string {
		// return full URL to API here
		return environment.baseUrl2 + url;
	}


	private showLoader(): void {
		this.isLoading = true;
	}

	private hideLoader(): void {
		this.isLoading = false;
	}

    /**
     * Request interceptor.
     */
	private requestInterceptor(): void {
		this.showLoader();
	}

    /**
     * Response interceptor.
     */
	private responseInterceptor(): void {
		this.hideLoader();
	}

    /**
     * Error handler.
     * @param error
     * @param caught
     * @returns {ErrorObservable}
     */
	private onCatch(error: any, caught: Observable<any>): Observable<any> {
		return Observable.throw(error);
	}

    /**
     * onSubscribeSuccess
     * @param res
     */
	private onSubscribeSuccess(res: Response): void {
	}

    /**
     * onSubscribeError
     * @param error
     */
	private onSubscribeError(error: any): void {
		this
			.serverError
			.emit(error);
	}

    /**
     * onFinally
     */
	private onFinally(): void {
		this.responseInterceptor();
	}
}
