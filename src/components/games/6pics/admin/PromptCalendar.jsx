import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const PromptCalendar = ({setDate}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [disabledDates, setDisabledDates] = useState([])

  const getPromptDates = async () => {

    setDisabledDates([])
    
    let { data: prompts, error } = await supabase
    .from('21thingsprompts')
    .select('date')

    if(prompts){
        prompts.forEach((p) => {
            let formDate = dayjs(p.date, "MM/DD/YYYY").format("YYYY-MM-DD")
            setDisabledDates(prev => ([
                ...prev, 
                formDate
            ]))
        })
    }
            
  }
  useEffect(() => {
    if(selectedDate){
        setDate(selectedDate.format("MM/DD/YYYY"))
    }
  }, [selectedDate])

  useEffect(() => {
    getPromptDates()
  }, [])

  const highlightedDates = ['2025-05-08', '2025-05-12'];

  const isDisabled = (day) =>
    disabledDates.includes(day.format('YYYY-MM-DD'));

  const renderDay = (day, selectedDates, pickersDayProps) => {
    const formatted = day.format('YYYY-MM-DD');
    const isHighlighted = highlightedDates.includes(formatted);
    const isDisabledDay = isDisabled(day);

    return (
      <PickersDay
        {...pickersDayProps}
        disabled={isDisabledDay}
        sx={{
          backgroundColor: isHighlighted ? 'black' : undefined,
          color: isHighlighted ? 'white' : undefined,
          '&:hover': {
            backgroundColor: isHighlighted ? '#1565c0' : undefined,
          },
        }}
      />
    );
  };

  return (
    <Stack direction="column" width="100%" height="15%" alignItems="center" justifyContent="center" p={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select a date"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          shouldDisableDate={isDisabled}
          renderDay={renderDay}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default PromptCalendar;
