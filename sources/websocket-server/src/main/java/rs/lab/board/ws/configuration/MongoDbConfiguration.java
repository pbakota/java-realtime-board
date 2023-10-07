package rs.lab.board.ws.configuration;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import lombok.extern.slf4j.Slf4j;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

@Slf4j
@Configuration
public class MongoDbConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongodbUrl;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    @Bean
    public MongoClient mongoClientFactory() {
        log.debug("Creating Mongodb Client");
        var connectionString = new ConnectionString(mongodbUrl);
        var pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        var pojoCodecRegistry = fromRegistries(getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));

        var settings = MongoClientSettings.builder()
                .codecRegistry(pojoCodecRegistry)
                .applyConnectionString(connectionString)
                .build();

        return MongoClients.create(settings);
    }

    @Bean
    public MongoDatabase mongoDatabase(@Autowired MongoClient client) {
        CodecProvider pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        CodecRegistry pojoCodecRegistry = fromRegistries(getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));

        return client.getDatabase(this.databaseName).withCodecRegistry(pojoCodecRegistry);
    }

    @Bean
    public MongoDatabaseFactory mongoDbDatabaseFactory(@Autowired MongoClient client) {
        return new SimpleMongoClientDatabaseFactory(client, this.databaseName);
    }

    @Bean
    public MongoTransactionManager transactionManager(@Autowired MongoDatabaseFactory mongoDbFactory) throws Exception {
        return new MongoTransactionManager(mongoDbFactory);
    }
}

