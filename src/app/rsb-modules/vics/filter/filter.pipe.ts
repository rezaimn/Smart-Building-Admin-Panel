import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter',
	pure: false

})
@Injectable()
export class FilterPipe implements PipeTransform {

	transform(users: any, peopleFilter: any): any {
		if (peopleFilter === undefined) return users;
		return users.filter(function(user) {
			let namefound = (user.firstName.toLowerCase().includes(peopleFilter.nameFilter.toLowerCase())) ||
				(user.lastName.toLowerCase().includes(peopleFilter.nameFilter.toLowerCase()));
			let statusfilter = false;
			if (peopleFilter.managerStatusFilter === "2") {
				if (user.favorite && namefound) {
					return true;
				}
			} else
				if (peopleFilter.managerStatusFilter === "3") {
					if (user.online && namefound) {
						return true;
					}
				}
				else
					if (peopleFilter.managerStatusFilter === "4") {
						if (!user.online && namefound) {
							return true;
						}
					} else
						return (namefound);

			;
		})
	}

}
