import { useEffect, useState } from 'react';
import { MenuItem, Select, Stack, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import {ListItem} from '@mui/material';

const PackLIstItem = ({name, value, packSorts, packId, setResetForm, getAllPacks}) => {

    const [sortNumber, setSortNumber] = useState()

    const updateSort = async (newSortNumber) => {
  if (newSortNumber === sortNumber) return;

  // 1. Find the other pack (if any) with the target sort number
  const { data: otherPackData, error: findError } = await supabase
    .from('sixpicspacks')
    .select('id')
    .eq('sort_order', newSortNumber)
    .single();

  if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found, that's okay
    console.error("Error finding other pack:", findError);
    return;
  }

  // 2. Update the current pack to new sort number
  const { error: updateCurrentError } = await supabase
    .from('sixpicspacks')
    .update({ sort_order: newSortNumber })
    .eq('id', packId);

  if (updateCurrentError) {
    console.error("Error updating current pack:", updateCurrentError);
    return;
  }

  // 3. If another pack exists with the desired sort_number, swap its value to current sortNumber
  if (otherPackData) {
    const { error: updateOtherError } = await supabase
      .from('sixpicspacks')
      .update({ sort_order: sortNumber })
      .eq('id', otherPackData.id);

    if (updateOtherError) {
      console.error("Error updating swapped pack:", updateOtherError);
      // Optionally revert previous update if needed
      return;
    }
    getAllPacks()
    setResetForm(prev => prev + 1);
  }

  // 4. Update local state and trigger refresh
  setSortNumber(newSortNumber);
};

    useEffect(() => {
        if(name === 'Sort order') {
            // console.log(value)
            setSortNumber(value)
        }
    }, [name])

    const noDisplay = [ 
        'Id',
        'Created at',
        'Promo url',
        'Note',
        'Promo image',
        'Marked for delete'
    ]

  return (
    <>
                {
                    !noDisplay.includes(name) && 
                    <>
                        <Stack direction={'column'} width={`auto`} alignItems={'center'} justifyContent={'flex-start'} height={'100px'}>

                        <Typography fontSize={15}>{name}</Typography>
                        {name === 'Graphic' 
                        ?
                            <video
                                src={value}
                                preload="metadata"
                                width={'95%'}
                                height={'80%'}
                                onLoadedMetadata={(e) => {
                                    e.target.currentTime = e.target.duration;
                                }}
                            />
                        :
                        <>
                                {
                                    name === 'Sort order' && sortNumber &&
                                    <>
                                        <Select
                                            onChange={e => updateSort(e.target.value)} 
                                            value={sortNumber}
                                            sx={{ width: '100px' }}
                                            >
                                            {packSorts
                                                .sort((a, b) => b - a)
                                                .map((p) => (
                                                <MenuItem key={p} value={p}>{p}</MenuItem>
                                                ))}
                                        </Select>
                                    </>
                                }
                                {
                                    typeof value === "string" && name !== 'Sort order' &&
                                    <Typography>{value}</Typography>
                                }
                                {
                                    typeof value === "number" && name !== 'Sort order' &&
                                    <Typography>{value}</Typography>
                                }
                                {
                                    name === 'Videos' && name !== 'Sort order' &&
                                    <Typography>{value?.length}</Typography>
                                }
                                
                            </>
                        }
                        </Stack>
                </>
            }
            </>
  );
};

export default PackLIstItem;