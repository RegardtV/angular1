import { InMemoryDbService } from 'angular-in-memory-web-api';
import { RequestInfo } from 'angular-in-memory-web-api/interfaces'
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

import { User } from '../models/user';

export class UserData implements InMemoryDbService {
  
  users: User [];

  constructor() {
    this.users = [
      {
        id: 1,
        username: 'Jonno',
        firstName: 'Jonathan',
        lastName: 'Benke',
        email: 'jb@gmail.com',
        password: 'Guru1984',
      },
      {
        id: 2,
        username: 'Des',
        firstName: 'Desmond',
        lastName: 'Serape',
        email: 'desmondserape@hotmail.com',
        password: 'OGdesmond1',
      },
      {
        id: 3,
        username: 'susan',
        firstName: 'Susan',
        lastName: 'Van der merwe',
        email: 'susanvdm@gmail.com',
        password: 'Belinda2018',
      },
      {
        id: 4,
        username: 'kiki',
        firstName: 'Sarah',
        lastName: 'Fell',
        email: 'fells@shoprite.co.za',
        password: 'Fs444667',
      },
      {
        id: 5,
        username: 'Vossie',
        firstName: 'Dawid',
        lastName: 'Vos',
        email: 'dvos@us.ac.za',
        password: 'ElvisPresley60s',
      }
    ]
  }
  
  createDb(): { users: User[] } {
    const users = this.users
    return { users };
  }

  // HTTP POST interceptor
  post(reqInfo: RequestInfo) {
    // if api/checkduplicate is pinged call checkDuplicateUser
    if(reqInfo.collectionName === 'checkduplicate') {
      return this.checkDuplicateUser(reqInfo);
    }
    // if api/authenticate is pinged call authenticate
    if (reqInfo.collectionName === 'authenticate') {
      return this.authenticate(reqInfo);
    }
    // otherwise default response of in-memory api
    return undefined
  }

  private checkDuplicateUser(reqInfo: RequestInfo): Observable<Response> {
    // return an Observable response
    return reqInfo.utils.createResponse$(() => {
      console.log('HTTP POST api/checkDuplicate override')
      const { headers, url, req } = reqInfo;
      const newUser: User = reqInfo.utils.getJsonBody(req);
      const duplicateUser: number = this.users.filter(user => { return user.username === newUser.username; }).length;
      if (duplicateUser) {
        return {              
          status: 401, 
          headers, 
          url, 
          body: { } 
        }        
      }
      else {
        return {
          status: 200, 
          headers, 
          url, 
          body: { } 
        }
      }
    })
  }
    
  private authenticate(reqInfo: RequestInfo): Observable<Response> {
    // return an Observable response
    return reqInfo.utils.createResponse$(() => {
      console.log('HTTP POST api/authenticate override')
      const { headers, url, req } = reqInfo;
      const userLoginDetails: Object = reqInfo.utils.getJsonBody(req);
      const matchedUser: User[] = this.users.filter(user => {return user.username === userLoginDetails[Object.keys(userLoginDetails)[0]] &&
                                                                    user.password === userLoginDetails[Object.keys(userLoginDetails)[1]] })
      if (matchedUser.length) {      
        localStorage.setItem('currentUser', JSON.stringify(matchedUser[0])); 
        AuthenticationService.currentUser.next(JSON.stringify(matchedUser[0]));
        return {              
          status: 200,
          headers, 
          url, 
          body: { } 
        }        
      }
      else {
        return {
          status: 401, 
          headers, 
          url, 
          body: { } 
        }
      }
    })
  }    
}
  