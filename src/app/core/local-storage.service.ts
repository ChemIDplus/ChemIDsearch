import { Logger } from './logger';

export enum Expires {
	/** 20 minutes = 20 * 60 */
	SHORT = 1200,
	/* 24 * 60 * 60 */
	DAY = 86400,
	/** 30 days = 30 * 24 * 60 * 60 */
	MONTH = 2592000,
	/** 10 years = 10 * 365.25 * 24 * 60 * 60 */
	YEARS = 315576000
}

export class LocalStorageService {

	// Rarely, if ever, increase this, as it will cause removeAllIfOldVersion to blow away users' history and preferences.
	private static readonly VERSION :number = 3;

	public static setString(key :string, data :string, expiresSeconds ? :Expires) :void {
		if(localStorage && key && data){
			this.set(key, data, expiresSeconds);
		}
	}
	public static getString(key :string) :string {
		if(localStorage && key){
			return this.getOrRemove(key);
		}
	}

	/* tslint:disable-next-line:no-any */
	public static setObject(key :string, data :any, expiresSeconds ? :Expires) :void {
		if(localStorage && key && data){
			this.set(key, JSON.stringify(data), expiresSeconds);
		}
	}
	/* tslint:disable-next-line:no-any */
	public static getObject(key :string) :any {
		if(localStorage && key){
			const data :string = this.getOrRemove(key);
			if(data){
				return JSON.parse(data);
			}
		}
	}

	public static removeItem(key :string) :void {
		if(localStorage && key){
			Logger.info('LocalStorage.removeItem ' + key);
			localStorage.removeItem(key);
		}
	}

	public static removeExpired() :void {
		if(localStorage){
			Logger.info('LocalStorage.removeExpired');
			Object.keys(localStorage).forEach( (key :string) => {
				this.getOrRemove(key);
			});
		}
	}

	public static removeAllIfOldVersion() :void {
		if(localStorage){
			Logger.trace('LocalStorage.removeOldVersion');
			const v :number = +(this.getOrRemove('version') || '0');
			if(v < this.VERSION){
				Logger.warn('LocalStorage.removeAllIfOldVersion found old version: CLEARING LOCAL STORAGE');
				localStorage.clear();
				this.set('version', this.VERSION.toString(10));
			}
		}
	}

	private static set(key :string, data :string, expiresSeconds ? :Expires) :void {
		this.log(key, data, 'set');
		const data2 :string = 'e' + ( expiresSeconds ? Date.now() + (expiresSeconds * 1000) : '') + ';' + data;
		try{
			localStorage.setItem(key, data2);
		}catch(e){
			try{
				// Probably out of space. Purge any that are expired and try again.
				this.removeExpired();
				localStorage.setItem(key, data2);
			}catch(e2){
				Logger.warn('LocalStorage Exception: ' + e2);
			}
		}
	}
	private static getOrRemove(key :string) :string {
		const s :string = localStorage.getItem(key);
		if(s){
			const aTerms :RegExpMatchArray = s.match(/^e([0-9]*);(.*)$/);
			if(!aTerms){
				Logger.warn('LocalStorage.getOrRemove found incorrectly formatted value: CLEARING LOCAL STORAGE');
				localStorage.clear();
				return undefined;
			}
			const sExpires :string = aTerms[1],
				expires :number = sExpires && sExpires.length && parseInt(sExpires, 10),
				expired :boolean = expires && expires <= Date.now(),
				data :string = aTerms[2];
			this.log(key, data, expired ? 'remove expired' : 'get');
			if(expired){
				localStorage.removeItem(key);
			}else{
				return data;
			}
		}
	}
	private static log(key :string, data :string, methodName :string) :void {
		const aTerms :RegExpMatchArray = key.match(/^(sub|str)/);
		if(aTerms){
			Logger.log('LocalStorage.' + methodName + ' ' + aTerms[1]);
		}else{
			Logger.debug('LocalStorage.' + methodName + ' ' + key + ' length=' + data.length);
		}
	}

}
