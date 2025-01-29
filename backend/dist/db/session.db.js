"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SessionManager {
    filePath;
    constructor() {
        this.filePath = path.resolve(__dirname, '../db/session.db.json');
    }
    readFile() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }
        const data = fs.readFileSync(this.filePath, 'utf-8');
        if (!data)
            return [];
        return JSON.parse(data);
    }
    writeFile(sessions) {
        fs.writeFileSync(this.filePath, JSON.stringify(sessions, null, 2), 'utf-8');
    }
    createSession(sessionId, sessionName) {
        const sessions = this.readFile();
        if (sessions.find(session => session.sessionId === sessionId)) {
            throw new Error('Session already exists');
        }
        sessions.push({ sessionId, sessionName, users: [] });
        this.writeFile(sessions);
    }
    deleteSession(sessionId) {
        let sessions = this.readFile();
        sessions = sessions.filter(session => session.sessionId !== sessionId);
        this.writeFile(sessions);
    }
    addUserToSession(sessionId, username, points) {
        const sessions = this.readFile();
        const session = sessions.find(session => session.sessionId === sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        if (session.users.find(user => user.username === username)) {
            throw new Error('User already exists in session');
        }
        session.users.push({ username, points, showPoints: false });
        this.writeFile(sessions);
        return { username, points, showPoints: false };
    }
    removeUserFromSession(sessionId, username) {
        const sessions = this.readFile();
        const session = sessions.find(session => session.sessionId === sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        session.users = session.users.filter(user => user.username !== username);
        this.writeFile(sessions);
    }
    updateUserPoints(sessionId, username, points) {
        const sessions = this.readFile();
        const session = sessions.find(session => session.sessionId === sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        const user = session.users.find(user => user.username === username);
        if (!user) {
            throw new Error('User not found in session');
        }
        user.points = points;
        this.writeFile(sessions);
        return user;
    }
    getSession(sessionId) {
        const sessions = this.readFile();
        return sessions.find(session => session.sessionId === sessionId);
    }
    getUsersBySession(sessionId) {
        const sessions = this.readFile();
        return sessions.find(session => session.sessionId === sessionId)?.users;
    }
    toggleUserShowPoints(sessionId, username) {
        const sessions = this.readFile();
        const session = sessions.find(session => session.sessionId === sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        const user = session.users.find(user => user.username === username);
        if (!user) {
            throw new Error('User not found in session');
        }
        // Toggle the showPoints value
        user.showPoints = !user.showPoints;
        this.writeFile(sessions);
        // Return the current status of showPoints
        return user.showPoints;
    }
}
exports.default = SessionManager;
