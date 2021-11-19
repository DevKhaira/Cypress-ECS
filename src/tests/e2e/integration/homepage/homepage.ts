/* eslint-disable new-cap */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'; // eslint-disable-line import/no-unresolved
import { IHomepage } from '../../interfaces/homepage';
import { TYPES } from '../../../../../types';
import { ioc } from '../inversify.config';
const homepage = ioc.get<IHomepage>(TYPES.Homepage);

Given('I am on the test page', () => {
  homepage.visit();
});

When('I click render button', () => {
  homepage.renderButton();
})

Then('I should be able to submit the answers to the challenge', () => {
  homepage.fillTheAnswersUp().then(
    result => {
      homepage.submitButton(result);
    }
  )

})