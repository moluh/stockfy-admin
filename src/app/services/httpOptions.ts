import { HttpHeaders } from '@angular/common/http';

export class HttpOptions {

  public static httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

}
