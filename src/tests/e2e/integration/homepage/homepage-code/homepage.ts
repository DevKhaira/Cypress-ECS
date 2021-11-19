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
       // grabbing each row 
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
                //getting the arrays were all strings so I needed to convert them
                this.turnArrayIntoInteger(row).then(integerArray => {
                    tableArray.push(integerArray);
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

                // this will stop the search and return the position if the sum of the first half is the same as the second half    
                } else if (checkIfFirstHalfIsTheSameAsTheSecondHalf(firstHalfOfAnArray, secondHalfOfAnArray)) {
                    i=centreOfArray;
                    return positionInArray;
                }

            } else {
                positionInArray++;
                firstHalfOfAnArray = row.slice(0, positionInArray);
                secondHalfOfAnArray = row.slice(positionInArray + 1);

                //this will stop the search if the array goes back and forward
                if(addArraysUp(firstHalfOfAnArray).toString() > addArraysUp(secondHalfOfAnArray).toString()) {
                    return null;
                
                // this will stop the search and return the position if the sum of the first half is the same as the second half    
                } else if (checkIfFirstHalfIsTheSameAsTheSecondHalf(firstHalfOfAnArray, secondHalfOfAnArray)) {
                    i = centreOfArray;
                    return positionInArray;
                }
            }
        }
        
        return null;
    }

    public fillTheAnswersUp = () => {        
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
 