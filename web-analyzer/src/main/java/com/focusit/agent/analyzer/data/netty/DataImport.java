package com.focusit.agent.analyzer.data.netty;

import com.focusit.agent.analyzer.data.netty.session.NettySessionManager;

import javax.inject.Inject;

/**
 * Base class for importing specific profiling data to mongodb
 * Created by Denis V. Kirpichenkov on 30.12.14.
 */
public abstract class DataImport<S> {

	@Inject
	private NettySessionManager sessionManager;

	public void onSessionStart(long appId){
	}

	public void onSessionStop(long appId){
	}

	protected final Long getSessionIdByAppId(long appId){
		return sessionManager.getCurrentSessionId(appId);
	}

	protected final long  getRecIdBySessionIdByAppId(long appId, long sessionId){
		return sessionManager.getRecIdBySessionIdByAppId(appId, sessionId);
	}

	protected final boolean isProfilingEnabled(long appId){
		return sessionManager.isProfilingEnabled(appId);
	}

	protected final boolean isMonitoringEnabled(long appId){
		return sessionManager.isMonitoringEnabled(appId);
	}

	public void importSample(long appId, S sample){
		Long sessionId = getSessionIdByAppId(appId);
		if(sessionId==null){
			return;
		}

		long recId = getRecIdBySessionIdByAppId(appId, sessionId);
		importSampleInt(appId, sessionId, recId, sample);
	}

	protected abstract void importSampleInt(long appId, long sessionId, long recId, S sample);
}
