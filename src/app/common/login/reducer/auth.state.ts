import { User } from '../../common.interface';
import * as fromActions from '../actions/auth.actions';

export interface AuthState {
	loggedIn: boolean;
	user: User;
}
export const initialState: AuthState = {
	loggedIn: false,
	user: undefined
};
