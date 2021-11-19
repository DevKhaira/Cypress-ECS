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

    private collectRow = (row) => {
        const rowArray = [];
        // turns every value into an integer and returns it into the row of the array
        return cy.wrap(row).find('td').each(cell => {
            rowArray.push(parseInt(cell.contents().text(), 10));
        }).then(() => {
            return rowArray
        })
    }

    private getValuesOfTheTable = () => {
        const tableArray = [];
        return cy.get(this.selectors.tableRow).each( tableRow => {
            //compiling each row and putting in the results into a table
            this.collectRow(tableRow).then(row => {
                tableArray.push(row);
            })
        }).then(() => {
            return tableArray;
        })
    }

    private checkWhereTheIndexIs = (row) => {
        const centreOfArray = Math.ceil(row.length/ 2);
        let positionInArray = centreOfArray;
        let firstHalfOfAnArray = row.slice(0, positionInArray);
        let secondHalfOfAnArray= row.slice(positionInArray);
                
        const addArraysUp = sectionOfArray => {
            return sectionOfArray.reduce(function (a, b) {
            return a + b;
          }, 0);
        }

        // check if the sums are the same
        const checkIfFirstHalfIsTheSameAsTheSecondHalf = (firstHalf, secondHalf) => addArraysUp(firstHalf) === addArraysUp(secondHalf);

        // as this is a binary search (sort of), we won't need to check more than half the length of the array 
        for (let i = 0; i < centreOfArray; i++) {
            if(addArraysUp(firstHalfOfAnArray).toString() > addArraysUp(secondHalfOfAnArray).toString()) {
                positionInArray--;

                //split the row into two arrays from the position in question
                firstHalfOfAnArray = row.slice(0, positionInArray);
                secondHalfOfAnArray= row.slice(positionInArray+1);

                //this will stop the search if the array goes back and forward
                if(addArraysUp(firstHalfOfAnArray).toString() < addArraysUp(secondHalfOfAnArray).toString()) {
                    return null;
                };  

                // this will stop the search and return the position if the sum of the first half is the same as the second half    
                if (checkIfFirstHalfIsTheSameAsTheSecondHalf(firstHalfOfAnArray, secondHalfOfAnArray)) {
                    return positionInArray;
                }

            } else {
                positionInArray++;

                //split the row into two arrays from the position in question
                firstHalfOfAnArray = row.slice(0, positionInArray);
                secondHalfOfAnArray = row.slice(positionInArray + 1);

                //this will stop the search if the array goes back and forward
                if(addArraysUp(firstHalfOfAnArray).toString() > addArraysUp(secondHalfOfAnArray).toString()) {
                    return null;
                }
                
                // this will stop the search and return the position if the sum of the first half is the same as the second half    
                if (checkIfFirstHalfIsTheSameAsTheSecondHalf(firstHalfOfAnArray, secondHalfOfAnArray)) {
                    return positionInArray;
                }
            }
        }    
        return null;
    }

    public fillTheAnswersUp = () => {        
        //put rows in an array
        const allTheData = this.getValuesOfTheTable();
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
 