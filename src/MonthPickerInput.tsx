import React, { Component } from 'react';
import InputMask from 'react-input-mask';

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const DATE_FORMAT = {
  "default": 'MM/YY',
  "ja": 'YY/MM'
}

import MonthCalendar from './calendar';
import { valuesToMask, valuesFromMask } from './utils';

import './styles/index.css';

type OnChange = (maskedValue: string, year: number, month: number) => any;

export interface IProps {
  year?: number,
  month?: number,
  lang?: string,
  inputProps?: {
    name?: string,
    id?: string,
  },
  onChange?: OnChange,
  closeOnSelect?: boolean
};

export interface IState {
  year: void|number,
  month: void|number,
  inputValue: string,
  showCalendar: boolean,
  yearSelected: Array<string>
};

class MonthPickerInput extends Component<IProps, IState> {
  wrapper: HTMLDivElement;
  input: { input: Element };

  public static defaultProps: Partial<IProps> = {
    inputProps: {},
    closeOnSelect: false
  };

  constructor(props) {
    super(props);
    const { year, month } = this.props;
    let inputValue = '';

    if (typeof year == 'number' && typeof month == 'number') {
      inputValue = valuesToMask(month, year, this.props.lang);
    }

    this.state = {
      year,
      month,
      inputValue,
      showCalendar: false,
      yearSelected: []
    }
  };


  moment = extendMoment(Moment);

  onCalendarChange = (year, month): void => {
    const inputValue = valuesToMask(month, year, this.props.lang);
    this.setState({
      inputValue,
      year,
      month,
      showCalendar: !this.props.closeOnSelect
    });
    this.onChange(inputValue, year, month);
  };

  onInputChange = (e: { target: { value: string }}): void => {
    const mask = e.target.value;

    if (mask.length && mask.indexOf('_') === -1) {
      const [month, year] = valuesFromMask(mask);
      const inputValue = valuesToMask(month, year, this.props.lang);
      this.setState({ year, month, inputValue });
      this.onChange(inputValue, year, month);
    } else this.setState({ inputValue: mask });
  };

  onChange = (inputValue, year, month): void => {
    if (this.props.onChange) {
      this.props.onChange(inputValue, year, month);
    }
    
    this.handleDateRange(year, month);
  };

  onInputBlur = (e): void => {
    if (!this.wrapper.contains(e.target)) {
      this.setState({ showCalendar: false })
    }
  };

  onInputFocus = (e): void => {
    if (this.wrapper.contains(e.target)) {
      this.setState({ showCalendar: true });
    }
  };

  onCalendarOutsideClick = (e): void => {
    this.setState({ showCalendar: this.input.input == e.target });
  };

  calendar = (): JSX.Element => {
    const { year, month } = this.state;
    let lang = this.props.lang ? this.props.lang : 'default';
    
    return (
      <div style={{ position: 'relative' }}>
        <MonthCalendar
          year={year}
          month={month}
          lang={lang}
          onChange={this.onCalendarChange}
          onOutsideClick={this.onCalendarOutsideClick}
        />
      </div>
    )
  };

  inputProps = (): object => {
    let dateFormat = DATE_FORMAT["default"];
    if (this.props.lang == "ja") {
      dateFormat = DATE_FORMAT["ja"];
    }
    return Object.assign({}, {
      ref: input => { if(input) this.input = input; },
      mask: "99/99",
      placeholder: dateFormat,
      type: 'text',
      onBlur: this.onInputBlur,
      onFocus: this.onInputFocus,
      onChange: this.onInputChange,
    }, this.props.inputProps)
  };

  // =======================

  handleDateResult = data => {
    console.log('data', data)
    let parseDateRange

    if (data.length > 12) {
      parseDateRange = data.slice(0, 12)
    } else if (data.length < 12) {
      this.handleMinMonths(data);
    } else {
      parseDateRange = data
    }

    console.log('parseDateRange', parseDateRange)
  }

  handleDateRange = (year, month) => {
    const InitialStartDate = this.moment(`${year}-${month.length > 1 ? month : '0' + month}-01`).format();
    const selectedDate = new Date(year, month);

    const start = this.moment((month !== undefined && year !== undefined) ? selectedDate : InitialStartDate);
    const result = this.moment(start).format();
    
    console.log(result)

    this.handleDateResult(result)
  }

  handleMinMonths = params => {
    const test = params[0].split(' ')
    let month = Number(test[0])
    let year = Number(test.pop())
    console.log('params', month, year, params)

    this.handleDateRange(year, month);
  }

  // =======================

  componentDidMount () {
    const { year, month } = this.props

    this.handleDateRange(year, month)
  }

  render() {
    const { inputValue, showCalendar } = this.state;

    return (
      <div ref={wrap => { if(wrap) this.wrapper = wrap; }}>
        <InputMask
          value={inputValue}
          {...this.inputProps()}
        />

        { this.calendar() }
        {/* { showCalendar && this.calendar() } */}
      </div>
    );
  };
};

export default MonthPickerInput;
