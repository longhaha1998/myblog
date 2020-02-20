import React, {Suspense} from 'react';
const DragLiDemo = React.lazy(() => import('./dragLi'));
const TicTacToeDemo = React.lazy(() => import('./tic-tac-toe'));
const HackerCode = React.lazy(() => import('./hackerCode'));

const route = [
    {
        name:'可拖动的li',
        pathname:'/home/demo/tic-tac-toe',
        component: <Suspense><DragLiDemo /></Suspense>
    },
    {
        name:'井字棋',
        pathname:'/home/demo/dragLi',
        component: <Suspense><TicTacToeDemo /></Suspense>
    },
    {
        name:'黑客帝国代码雨',
        pathname:'/home/demo/hackerCode',
        component: <Suspense><HackerCode /></Suspense>
    }
];

export default route;