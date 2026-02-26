package logging

import (
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"time"
)

var goaccessLogger = log.New(os.Stdout, "", 0)

func SetOutput(w io.Writer) {
	goaccessLogger.SetOutput(w)
}

type responseWriter struct {
	http.ResponseWriter
	status int
	size   int
}

func (rw *responseWriter) WriteHeader(statusCode int) {
	rw.status = statusCode
	rw.ResponseWriter.WriteHeader(statusCode)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	size, err := rw.ResponseWriter.Write(b)
	rw.size += size
	return size, err
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := &responseWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(rw, r)

		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			ip = r.RemoteAddr
		}

		referer := r.Referer()
		if referer == "" {
			referer = "-"
		}

		userAgent := r.UserAgent()
		if userAgent == "" {
			userAgent = "-"
		}

		goaccessLogger.Printf(
			`%s - - [%s] "%s %s %s" %d %d "%s" "%s"`,
			ip,
			start.Format("02/Jan/2006:15:04:05 -0700"),
			r.Method,
			r.RequestURI,
			r.Proto,
			rw.status,
			rw.size,
			referer,
			userAgent,
		)
	})
}
