import React from 'react';
const DragLiDemo = React.lazy(() => import('./dragLi'));
const TicTacToeDemo = React.lazy(() => import('./tic-tac-toe'));

const route = [
    {
        name:'井字棋',
        pathname:'/home/demo/tic-tac-toe',
        component: <DragLiDemo />
    },
    {
        name:'可拖动的li',
        pathname:'/home/demo/dragLi',
        component: <TicTacToeDemo />
    }
];

export default route;