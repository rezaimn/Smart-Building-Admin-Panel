import { trigger, state, animate, style, transition, query, stagger } from '@angular/animations';

  
export function routerTransition() {
    return fadeInLeft();
    
}
function fadeInLeft() {
    return trigger('routerTransition', [
        state('void', style({ position: 'fixed', width: '80%', opacity: '0' })),
        state('*', style({ position: 'relative', width: '100%', opacity: '1' })),
        transition(':enter', [
            style({ transform: 'translateX(0%)', opacity: '0' }),
            animate('1s ease-in-out', style({ transform: 'translateX(0%)', opacity: '1' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)', opacity: '1' }),
            animate('0.2s ease-in-out', style({ transform: 'translateX(0%)', opacity: '0' }))
        ])
    ]);
}
function slideToRight() {
    return trigger('routerTransition', [
        state('void', style({ position: 'relative', width: '100%' })),
        state('*', style({ position: 'relative', width: '100%' })),
        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
        ])
    ]);
}

// function slideToBottom() {
//     return trigger('routerTransition', [
//         state('void', style({position: 'fixed', width: '100%', height: '100%'})),
//         state('*', style({position: 'fixed', width: '100%', height: '100%'})),
//         transition(':enter', [
//             style({transform: 'translateY(-100%)'}),
//             animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
//         ]),
//         transition(':leave', [
//             style({transform: 'translateY(0%)'}),
//             animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
//         ])
//     ]);
// }

// function slideToTop() {
//     return trigger('routerTransition', [
//         state('void', style({position: 'fixed', width: '100%', height: '100%'})),
//         state('*', style({position: 'fixed', width: '100%', height: '100%'})),
//         transition(':enter', [
//             style({transform: 'translateY(100%)'}),
//             animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
//         ]),
//         transition(':leave', [
//             style({transform: 'translateY(0%)'}),
//             animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
//         ])
//     ]);
// }