import { createGridData,  gridData } from './datasource';
import { GridModel } from '@syncfusion/ej2-react-grids'

createGridData();


export const GridInitialState: GridModel  = {
    dataSource:  gridData,
    pageSettings: { pageSize: 50},

};