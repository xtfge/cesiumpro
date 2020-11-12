import CesiumProError from './CesiumProError';

function abstract() {
  throw new CesiumProError('抽象方法无法被调用。');
}
export default abstract;
