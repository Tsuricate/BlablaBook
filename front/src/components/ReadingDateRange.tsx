import { DatePicker, Flex, Portal, Stack, Text, parseDate, type DateValue } from '@chakra-ui/react';
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
      variant="editorial"
      selectionMode="range"
      placeholder="dd/mm/yy"
      locale={locale}
      max={maxDate}
      value={readingDateRange}
      onValueChange={(e) => setReadingDateRange(e.value)}
    >
      <DatePicker.Label>
        <Flex align="center" gap={1}>
          <Text>{t('book:rating.readingDate')}</Text>

          <Text
            fontSize="small"
            fontWeight="400"
            color={{ _light: 'brown.600', _dark: 'light.600' }}
          >
            · {t('common:optional')}
          </Text>
        </Flex>
      </DatePicker.Label>

      <Flex gap={2} align="center" w="100%">
        <DatePicker.Control>
          <DatePicker.Input index={0} />
          <DatePicker.Input index={1} />
        </DatePicker.Control>

        <DatePicker.Trigger>
          <LuCalendar size={18} />
        </DatePicker.Trigger>
      </Flex>

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
