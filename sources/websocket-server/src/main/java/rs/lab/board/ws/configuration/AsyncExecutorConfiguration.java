package rs.lab.board.ws.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@EnableAsync
@Configuration
@Slf4j
public class AsyncExecutorConfiguration {
    public static final String TASK_EXECUTOR_CONTROLLER = "asyncController";
    private int corePoolSize = 500;
    private int maxPoolSize = 1000;

    @Bean(name = TASK_EXECUTOR_CONTROLLER)
    public Executor getControllerAsyncExecutor() {
        return newTaskExecutor("asyncSocket-");
    }

    public Executor newTaskExecutor(String prefix) {
        final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setThreadNamePrefix(prefix);
        executor.initialize();
        log.info("Initialized Async executor {}", prefix);
        return executor;
    }
}
