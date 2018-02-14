import { Logger } from './logger';

export class LocalStorageService {

	// Rarely, if ever, increase this, as it will cause removeAllIfOldVersion to blow away users' history and preferences.
	static readonly VERSION :number = 3;

	public static setString(key :string, data :string, expiresSeconds ? :number) :void {
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
	public static setObject(key :string, data :any, expiresSeconds ? :number) :void {
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

	private static set(key :string, data :string, expiresSeconds ? :number) :void {
		this.log(key, data, 'set');
		data = 'e' + ( expiresSeconds ? Date.now() + (expiresSeconds * 1000) : '') + ';' + data;
		try{
			localStorage.setItem(key, data);
		}catch(e){
			try{
				// Probably out of space. Purge any that are expired and try again.
				this.removeExpired();
				localStorage.setItem(key, data);
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
				return;
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
