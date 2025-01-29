import * as fs from 'fs';
import * as path from 'path';

interface User {
    username: string;
    points: number;
    showPoints: boolean
}

interface Session {
    sessionId: string;
    sessionName: string;
    users: User[];
}

export default class SessionManager {
    private filePath: string;

    constructor() {
        this.filePath = path.resolve(__dirname, '../db/session.db.json');
    }

    private readFile(): Session[] {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }
        const data = fs.readFileSync(this.filePath, 'utf-8');
        if(!data) return []
        return JSON.parse(data);
    }

    private writeFile(sessions: Session[]): void {
        fs.writeFileSync(this.filePath, JSON.stringify(sessions, null, 2), 'utf-8');
    }

    public createSession(sessionId: string, sessionName: string): void {
        const sessions = this.readFile();
        if (sessions.find(session => session.sessionId === sessionId)) {
            throw new Error('Session already exists');
        }
        sessions.push({ sessionId, sessionName, users: [] });
        this.writeFile(sessions);
    }

    public deleteSession(sessionId: string): void {
        let sessions = this.readFile();
        sessions = sessions.filter(session => session.sessionId !== sessionId);
        this.writeFile(sessions);
    }

    public addUserToSession(sessionId: string, username: string, points: number): User {
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
        return { username, points, showPoints: false }
    }

    public removeUserFromSession(sessionId: string, username: string): void {
        const sessions = this.readFile();
        const session = sessions.find(session => session.sessionId === sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        session.users = session.users.filter(user => user.username !== username);
        this.writeFile(sessions);
    }

    public updateUserPoints(sessionId: string, username: string, points: number): User {
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
        return user
    }

    public getSession(sessionId: string): Session | undefined {
        const sessions = this.readFile();
        return sessions.find(session => session.sessionId === sessionId);
    }

    public getUsersBySession(sessionId: string){
        const sessions = this.readFile();
        return sessions.find(session => session.sessionId === sessionId)?.users
    }

    public toggleUserShowPoints(sessionId: string, username: string): boolean {
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