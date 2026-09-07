import { DatePicker, Portal, parseDate, type DateValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuCalendar } from 'react-icons/lu';

type ReadingDateRangeProps = {
  readingDateRange: DateValue[];
  setReadingDateRange: React.Dispatch<React.SetStateAction<DateValue[]>>;
};

const ReadingDateRange = ({ readingDateRange, setReadingDateRange }: ReadingDateRangeProps) => {
  const { t } = useTranslation('book');
  const { i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const today = new Date().toISOString().split('T')[0];
  const maxDate = parseDate(today);

  return (
    <DatePicker.Root
      selectionMode="range"
      maxWidth="20rem"
      placeholder="dd/mm/yy"
      locale={locale}
      max={maxDate}
      value={readingDateRange}
      onValueChange={(e) => setReadingDateRange(e.value)}
    >
      <DatePicker.Label>{t('book:rating.readingDate')}</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input index={0} />
        <DatePicker.Input index={1} />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <LuCalendar />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
};

export default ReadingDateRange;
