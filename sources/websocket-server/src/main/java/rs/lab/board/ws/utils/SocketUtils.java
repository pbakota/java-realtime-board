package rs.lab.board.ws.utils;

import org.springframework.util.Assert;

import javax.net.ServerSocketFactory;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.util.Random;

// NOTE: Silly replacement for Spring SocketUtils since it is not available anymore
public class SocketUtils {

    private static final Random RANDOM = new Random(System.nanoTime());

    private static int findRandomPort(int minPort, int maxPort) {
        int portRange = maxPort - minPort;
        return minPort + SocketUtils.RANDOM.nextInt(portRange + 1);
    }

    private static boolean isPortAvailable(int port) {
        try {
            ServerSocket serverSocket = ServerSocketFactory.getDefault().createServerSocket(port, 1, InetAddress.getByName("localhost"));
            serverSocket.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static int findAvailablePort(int minPort, int maxPort) {
        Assert.isTrue(minPort > 0, "'minPort' must be greater than 0");
        Assert.isTrue(maxPort >= minPort, "'maxPort' must be greater than or equal to 'minPort'");
        Assert.isTrue(maxPort <= 65535, "'maxPort' must be less than or equal to 65535");
        int portRange = maxPort - minPort;
        int searchCounter = 0;

        while (searchCounter <= portRange) {
            int candidatePort = findRandomPort(minPort, maxPort);
            ++searchCounter;
            if (isPortAvailable(candidatePort)) {
                return candidatePort;
            }
        }

        throw new IllegalStateException(String.format("Could not find an available TCP port in the range [%d, %d] after %d attempts", minPort, maxPort, searchCounter));
    }
}
