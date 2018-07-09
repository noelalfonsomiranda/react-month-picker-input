import React from 'react';
import ReactDOM from 'react-dom';

import MonthPickerInput from 'react-month-picker-input';

ReactDOM.render(
  (
    <div>
      <label htmlFor="ex-0">
        Without default value
        <MonthPickerInput inputProps={{id: "ex-0", name: "ex-0"}} />
      </label>

      <label htmlFor="ex-1">
        With only default year
        <MonthPickerInput
          year={new Date().getFullYear()}
          inputProps={{id: "ex-1", name: "ex-1"}} />
      </label>

      <label htmlFor="ex-3">
        Japanese format
        <MonthPickerInput
          year={new Date().getFullYear()}
          month={new Date().getMonth()}
          lang="ja"
          inputProps={{id: "ex-3", name: "ex-3"}} />
      </label>

      <label htmlFor="ex-4">
        Close on month select
        <MonthPickerInput
          closeOnSelect={true}
          inputProps={{id: "ex-3", name: "ex-3"}} />
      </label>

      <label htmlFor="ex-2">
        With default year and month
        <MonthPickerInput
          inputRef={(ref) => {
            this.input = ref
          }}
          year={new Date().getFullYear()}
          month={new Date().getMonth()}
          inputProps={{id: "ex-2", name: "ex-2"}} 
          onChangeYearUpdate={false}
        />
          
      </label>
    </div>
  ),
  document.getElementById('examples')
);
