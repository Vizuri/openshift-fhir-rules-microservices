/*
    This module imports and exports the essential modules across the entire UI to reduce
    duplicate imports
*/

//Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({

    imports: [ CommonModule ],
    exports: [

        CommonModule,
        FormsModule
    ]
})

export class SharedModule { }