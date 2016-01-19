const DEFAULT_API_VERSION = '1.0.0';
const HEADER_API_VERSION_MATCHER = /application\/vnd\.api\.v(\d+(?:\.\d+){2})\+json/;

export default function (request, reply) {
    const version = request.headers['accept'].match(HEADER_API_VERSION_MATCHER);
    reply((version && version[1]) || DEFAULT_API_VERSION);
}
