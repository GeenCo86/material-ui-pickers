import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ToolbarText from '../_shared/ToolbarText';
import PickerToolbar from '../_shared/PickerToolbar';
import ToolbarButton from '../_shared/ToolbarButton';
import DateTimePickerTabs from './DateTimePickerTabs';
import { useUtils } from '../_shared/hooks/useUtils';
import { DateTimePickerView } from './DateTimePicker';
import { ToolbarComponentProps } from '../Picker/Picker';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMeridiemMode } from '../TimePicker/TimePickerToolbar';
import { arrayIncludes } from '../_helpers/utils';
import ClockType from '../constants/ClockType';
import { useEffect, useState } from 'react';
import { TypographyProps } from '@material-ui/core/Typography';

export const useStyles = makeStyles(
  _ => ({
    toolbar: {
      paddingLeft: 16,
      paddingRight: 16,
      justifyContent: 'space-around',
    },
    separator: {
      margin: '0 4px 0 2px',
      cursor: 'default',
    },
  }),
  { name: 'MuiPickerDTToolbar' }
);

export const DateTimePickerToolbar: React.FC<ToolbarComponentProps> = ({
  date,
  views,
  openView,
  setOpenView,
  ampm,
  hideTabs,
  dateRangeIcon,
  timeIcon,
  onChange,
}) => {
  const utils = useUtils();
  const classes = useStyles();
  const showTabs = !hideTabs && typeof window !== 'undefined' && window.innerHeight > 667;
  const { meridiemMode, handleMeridiemChange } = useMeridiemMode(date, ampm, onChange);
  const [timeFontVariant, setTimeFontVariant] = useState<TypographyProps['variant']>(
    arrayIncludes(views, 'seconds') ? 'h4' : 'h3'
  );
  const theme = useTheme();
  const rtl = theme.direction === 'rtl';

  useEffect(() => {
    setTimeFontVariant(arrayIncludes(views, 'seconds') ? 'h4' : 'h3');
  }, [views]);

  return (
    <>
      <PickerToolbar isLandscape={false} className={classes.toolbar}>
        <Grid container justify="center" wrap="nowrap">
          <Grid item container xs={5} justify="flex-start" direction="column">
            <div>
              <ToolbarButton
                variant="subtitle1"
                onClick={() => setOpenView('year')}
                selected={openView === 'year'}
                label={utils.getYearText(date)}
              />
            </div>
            <div>
              <ToolbarButton
                variant="h4"
                onClick={() => setOpenView('date')}
                selected={openView === 'date'}
                label={utils.getDateTimePickerHeaderText(date)}
              />
            </div>
          </Grid>

          <Grid
            item
            container
            xs={6}
            justify="center"
            alignItems="flex-end"
            direction={rtl ? 'row-reverse' : 'row'}
          >
            <ToolbarButton
              variant={timeFontVariant}
              onClick={() => setOpenView('hours')}
              selected={openView === 'hours'}
              label={utils.getHourText(date, ampm!)}
            />

            <ToolbarText variant={timeFontVariant} label=":" className={classes.separator} />

            <ToolbarButton
              variant={timeFontVariant}
              onClick={() => setOpenView('minutes')}
              selected={openView === 'minutes'}
              label={utils.getMinuteText(date)}
            />

            {arrayIncludes(views, ['minutes', 'seconds']) && (
              <ToolbarText
                variant={timeFontVariant}
                label=":"
                selected={false}
                className={classes.separator}
              />
            )}

            {arrayIncludes(views, 'seconds') && (
              <ToolbarButton
                variant={timeFontVariant}
                onClick={() => setOpenView(ClockType.SECONDS)}
                selected={openView === ClockType.SECONDS}
                label={utils.getSecondText(date)}
              />
            )}
          </Grid>

          {ampm && (
            <Grid item container xs={1} direction="column" justify="flex-end">
              <ToolbarButton
                variant="subtitle1"
                selected={meridiemMode === 'am'}
                label={utils.getMeridiemText('am')}
                onClick={() => handleMeridiemChange('am')}
              />

              <ToolbarButton
                variant="subtitle1"
                selected={meridiemMode === 'pm'}
                label={utils.getMeridiemText('pm')}
                onClick={() => handleMeridiemChange('pm')}
              />
            </Grid>
          )}
        </Grid>
      </PickerToolbar>

      {showTabs && (
        <DateTimePickerTabs
          dateRangeIcon={dateRangeIcon}
          timeIcon={timeIcon}
          view={openView as DateTimePickerView}
          onChange={setOpenView}
        />
      )}
    </>
  );
};
