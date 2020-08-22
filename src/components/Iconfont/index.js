import createIconSet from './createIconSet';
import glyphMap from '@app/assets/json/iconfont.json';

const Iconfont = createIconSet(glyphMap, 'iconfont', require('@app/assets/fonts/iconfont.ttf'));

export default Iconfont;
