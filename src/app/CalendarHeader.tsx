import { Box, Icon, IconButton, Avatar } from '@material-ui/core';
import React from 'react';

import { Link } from 'react-router-dom';

import { formatMonth, addMonths } from './dateFunctions';
import UserMenu from './UserMenu';

interface ICalendarHeaderProps {
  month: string;
}

export const CalendarHeader = React.memo(function CalendarHeader(
  props: ICalendarHeaderProps
) {
  const { month } = props;
  return (
    <Box display="flex" alignItems="center" padding="8px 16px">
      <Box>
        <IconButton
          aria-label="Mês anterior"
          component={Link}
          to={'/calendar/' + addMonths(month, -1)}
        >
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton
          aria-label="Próximo mês"
          component={Link}
          to={'/calendar/' + addMonths(month, 1)}
        >
          <Icon>chevron_right</Icon>
        </IconButton>
      </Box>
      <Box component="h3" flex="1">
        {formatMonth(month)}
      </Box>
      <UserMenu />
    </Box>
  );
});
