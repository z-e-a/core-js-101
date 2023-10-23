/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: function getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MyCssSelectorBuilder {
  constructor() {
    this.selector = '';
    this.components = [];
  }

  element(value) {
    if (this.components.includes('id') || this.components.includes('class') || this.components.includes('attribute')
    || this.components.includes('pseudo-class') || this.components.includes('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.components.includes('element')) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = this.selector + value;
    myCssSelectorBuilder.components = [...this.components];
    myCssSelectorBuilder.components.push('element');
    return myCssSelectorBuilder;
  }

  id(value) {
    if (this.components.includes('class') || this.components.includes('attribute')
    || this.components.includes('pseudo-class') || this.components.includes('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.components.includes('id')) { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); }
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = `${this.selector}#${value}`;
    myCssSelectorBuilder.components = [...this.components];
    myCssSelectorBuilder.components.push('id');
    return myCssSelectorBuilder;
  }

  class(value) {
    if (this.components.includes('attribute')
    || this.components.includes('pseudo-class') || this.components.includes('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = `${this.selector}.${value}`;
    myCssSelectorBuilder.components = [...this.components];
    myCssSelectorBuilder.components.push('class');
    return myCssSelectorBuilder;
  }

  attr(value) {
    if (this.components.includes('pseudo-class') || this.components.includes('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = `${this.selector}[${value}]`;
    myCssSelectorBuilder.components = [...this.components];
    myCssSelectorBuilder.components.push('attribute');
    return myCssSelectorBuilder;
  }

  pseudoClass(value) {
    if (this.components.includes('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = `${this.selector}:${value}`;
    myCssSelectorBuilder.components = [...this.components];
    myCssSelectorBuilder.components.push('pseudo-class');
    return myCssSelectorBuilder;
  }

  pseudoElement(value) {
    if (this.components.includes('pseudo-element')) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = `${this.selector}::${value}`;
    myCssSelectorBuilder.components = [...this.components];
    myCssSelectorBuilder.components.push('pseudo-element');
    return myCssSelectorBuilder;
  }

  combine(selector1, combinator, selector2) {
    this.combinator = combinator;
    const myCssSelectorBuilder = new MyCssSelectorBuilder();
    myCssSelectorBuilder.selector = `${selector1.selector} ${combinator} ${selector2.selector}`;
    return myCssSelectorBuilder;
  }

  stringify() {
    const result = this.selector;
    this.selector = '';
    this.components = [];
    this.components.length = 0;
    return result;
  }
}

const cssSelectorBuilder = new MyCssSelectorBuilder();

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
