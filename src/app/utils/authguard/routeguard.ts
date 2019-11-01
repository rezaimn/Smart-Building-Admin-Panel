import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {SessionStorage} from 'ngx-webstorage';

/**
 * @class AuthGuard
 * @classdesc
 *AuthGuard class checks for the session token, userid and csrf token,which in turn
 shows user is logged in and return true or else false.
 Which further used to redirect through navigate to other route
 * @var authguard is a variable which return boolean value to specify user login interaction
 * @return Flag with boolean value will be returned. True: If User is Authorized else False
 * @author gaurav.rao
 **/

@Injectable()
export class AuthGuard implements CanActivateChild {
    permission;
    @SessionStorage('user')
    public user;
    @SessionStorage('userPermissions')
    public userPermissions;

    constructor(private router: Router) {

    }

    /* Function to check whether user is logged in or not*/
    canActivateChild(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        for (let module of this.userPermissions) {

            if (route.data.status == 'module') {
              //  console.log("moduleeeeeeeeeeeee",module);
                if (module.module.id == route.data.moduleId) {
                    return true;
                }
            }
            if (route.data.status == 'screen') {
                for (let screen of module.module.screens) {
                 //   console.log("screeeeeeeen",screen);
                    if ((screen.screen.id == route.data.screenId && screen.permission.access!=2)||route.data.screenId==0) {
                        return true;
                    }
                }

            }
        }
        this.router.navigate(['/login']);
        return false;

    }

    /* Call the Parent function even for child routes*/
    // canActivateChild() {
    //     return this.canActivate();
    // }

}
