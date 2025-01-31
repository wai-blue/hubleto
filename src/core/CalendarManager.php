<?php

namespace HubletoMain\Core;

class CalendarManager
{

  public \HubletoMain $main;

  /** @var array<string, \HubletoMain\Core\Calendar> */
  protected array $calendars = [];

  public function __construct(\HubletoMain $main)
  {
    $this->main = $main;
  }

  public function addCalendar(string $calendarClass): void
  {
    $calendar = new $calendarClass($this->main);
    if ($calendar instanceof \HubletoMain\Core\Calendar) {
      $this->calendars[$calendarClass] = $calendar;
    }
  }

  /** @var array<string, \HubletoMain\Core\Calendar> */
  public function getCalendars(): array
  {
    return $this->calendars;
  }

  public function getCalendar(string $calendarClass): \HubletoMain\Core\Calendar
  {
    return $this->calendars[$calendarClass];
  }


}