import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../types';

// interfaces
import { IHomepage } from '../interfaces/homepage';

// implementations
import { Homepage } from '../integration/homepage/homepage-code/homepage';

const ioc = new Container();

ioc.bind<IHomepage>(TYPES.Homepage).to(Homepage);

export { ioc };
