/* eslint-disable cypress/no-unnecessary-waiting */
/* global cy */
import 'reflect-metadata';
import { injectable } from 'inversify';
import { IHomepage } from '../../../interfaces/homepage';
@injectable()
export class Homepage implements IHomepage {
    private selectors = {
        renderChallenge: '[data-test-id="render-challenge"]',
        table: 'table',
        button: '[type="button"]',
        tableRow: 'tbody tr',
        submit1: '[data-test-id="submit-1"]',
        submit2: '[data-test-id="submit-2"]',
        submit3: '[data-test-id="submit-3"]',
        submit4: '[data-test-id="submit-4"]',
    };
    public visit = () => {
        cy.visit('/');
        return this;
    };

    public renderButton = () => {
        cy.get(this.selectors.renderChallenge).click();
        cy.get(this.selectors.table).should('be.visible');
        return this;
    };

    private compileArray = (row) => {
            const rowArray = [];
            return cy.wrap(row).find('td').each(cell => {
                rowArray.push(cell.contents().text());
            }).then(() => {
                return rowArray
            })
    }

    private turnArrayIntoInteger = (row) => {
       return this.compileArray(row).then(row => { 
            const rowArrayIntegers = row.map(function(x){
                         return parseInt(x,10);
        })
        return rowArrayIntegers
    });
}

    private placeArraysInRow = () => {
            const tableArray = [];
            return cy.get(this.selectors.tableRow).each( row => {
                this.turnArrayIntoInteger(row).then(integerArray => {
                    tableArray.push(integerArray);
                })
            }).then(() => {
                return tableArray;
            })
    }

    private checkWhereTheIndexIs = (information) => {
        console.log(information.length/2);
        let centre = Math.ceil(information.length/ 2);
        let firstHalfOfAnArray = information.slice(0, centre);
        let secondHalfOfAnArray= information.slice(centre);
        const addArraysUp = sectionOfArray => {
            return sectionOfArray.reduce(function (a, b) {
            return a + b;
          }, 0);
        }
        let finish = false;
        let result = null;
        do{
            if(addArraysUp(firstHalfOfAnArray).toString() > addArraysUp(secondHalfOfAnArray).toString()) {
                centre--;
                firstHalfOfAnArray = information.slice(0, centre);
                secondHalfOfAnArray= information.slice(centre+1);
                if(addArraysUp(firstHalfOfAnArray).toString() < addArraysUp(secondHalfOfAnArray).toString()) {
                    finish = true;
                } else if (addArraysUp(firstHalfOfAnArray).toString() === addArraysUp(secondHalfOfAnArray).toString()) {
                    result = centre;
                    finish = true;
                }

            } else {
                centre ++;
                firstHalfOfAnArray = information.slice(0, centre);
                secondHalfOfAnArray= information.slice(centre+1);
                if(addArraysUp(firstHalfOfAnArray).toString() > addArraysUp(secondHalfOfAnArray).toString()) {
                    finish = true;
                } else if (addArraysUp(firstHalfOfAnArray).toString() === addArraysUp(secondHalfOfAnArray).toString()) {
                    result = centre;
                    finish = true;
                }
            }
        } while(!finish)
        
        return result;
    }

    public addArrays = () => {        
        //put rows in an array
        const allTheData = this.placeArraysInRow();
        const finalCount = ['Dev Khaira'];
        return  allTheData.each(perRow => {
            finalCount.push(this.checkWhereTheIndexIs(perRow)===null? 'null': this.checkWhereTheIndexIs(perRow).toString());
        }).then (() => {
            return finalCount;
        })
    };

    public submitButton = (finalResult) => {
        cy.get(this.selectors.submit1).type(finalResult[1]);
        cy.get(this.selectors.submit2).type(finalResult[2]);
        cy.get(this.selectors.submit3).type(finalResult[3]);
        cy.get(this.selectors.submit4).type(finalResult[0]);
        cy.get('button span').contains('Submit Answers').click();
        return this;
    };
}
 