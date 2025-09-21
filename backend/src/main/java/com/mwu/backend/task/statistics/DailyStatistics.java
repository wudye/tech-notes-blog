package com.mwu.backend.task.statistics;

import com.mwu.backend.model.entity.Statistic;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.repository.StatisticRepository;
import com.mwu.backend.repository.UserRepository;
import com.mwu.backend.service.StatisticService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
public class DailyStatistics {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private StatisticService statisticService;

    @Scheduled(cron = "0 59 23 * * ?" ) // 每天凌晨执行
    public void  dailyStatistics() {
        log.info("Daily Statistics");
        Statistic statistic = new Statistic();

        int todayLoginCount = userRepository.getTodayLoginCount();
        int todayRegisterCount = userRepository.getTodayRegisterCount();
        int totalRegisterCount = userRepository.getTotalRegisterCount();


        int todayNoteCount = noteRepository.getTodayNoteCount();
        int todaySubmitNoteUserCount = noteRepository.getTodaySubmitNoteUserCount();
        int totalNoteCount = noteRepository.getTotalNoteCount();


        statistic.setLoginCount(todayLoginCount);
        statistic.setRegisterCount(todayRegisterCount);
        statistic.setTotalRegisterCount(totalRegisterCount);

        statistic.setNoteCount(todayNoteCount);
        statistic.setSubmitNoteCount(todaySubmitNoteUserCount);
        statistic.setTotalNoteCount(totalNoteCount);

        statistic.setDate(LocalDate.now());

        try {
            statisticService.saveStatistic(statistic);
            log.info("Daily Statistics saved successfully");
        } catch (Exception e) {
            log.error("Error saving Daily Statistics: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}
