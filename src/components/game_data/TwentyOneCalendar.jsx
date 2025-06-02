import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const TwentyOneCalendar = ({setDayGame, dayGame}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [date, setDate] = useState()
  const [validDates, setValidDates] = useState(new Set())

  const getValidDates = async () => {
    
    let { data, error } = await supabase
    .from('21thingsprompts')
    .select('*')
    
        if(data){
            let array = new Set(
                data?.map((d) =>
                    dayjs(d?.date).format("YYYY-MM-DD")
                )
            );
            setValidDates(array);
        }
    }

  const getPromptDates = async (dt) => {
        let { data, error } = await supabase
            .from('twentyone_things_data')
            .select("*")
            .eq('game_date', dt)
            if(data?.length){
                    setDayGame(data)
                } else {
                    setDayGame([])
                }
  }

  useEffect(() => {
    if(selectedDate){
        setDate(selectedDate.format("YYYY-MM-DD"))
    }
  }, [selectedDate])

  useEffect(() => {
    if(date && !dayGame){
        getValidDates()
        getPromptDates(date)
    }
  }, [date, dayGame])

  return (
    <Stack direction="column" width="100%" height="100%" alignItems="center" justifyContent="center" p={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            shouldDisableDate={(day) => {
                const formatted = day.format("YYYY-MM-DD");
                return !validDates.has(formatted);
            }}
          label="Select a date"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default TwentyOneCalendar;
